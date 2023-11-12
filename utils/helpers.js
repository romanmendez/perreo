import { DateTime, Duration } from 'luxon'
import _ from 'lodash'

export async function updateResolver(model, args, context) {
	const data = _.omit(args, ['id'])
	return await context.model[model].findOneAndUpdate({ _id: args.id }, data, {
		returnOriginal: false,
	})
}

export async function deleteResolver(model, args, context) {
	const { ok } = await context.model[model].deleteOne({ _id: args.id })
	if (!ok) throw new Error('No record was found with this ID')
	return ok
}

function daysBetween(start, end) {
	return start.getDate() - end.getDate() * 24 * 60 * 60000
}

function duration(startTime, endTime) {
	const start = DateTime.fromJSDate(startTime)
	const end = DateTime.fromJSDate(endTime || new Date())
	const diff = end.diff(start, ['hours', 'minutes'])

	const hours = String(Math.floor(diff.hours)).padStart(2, '0')
	const minutes = String(Math.floor(diff.minutes) % 60).padStart(2, '0')

	return { hours, minutes }
}

function balance(startTime, endTime, price) {
	const { hours, minutes } = duration(startTime, endTime)
	const attendanceTimeInMinutes = Number(hours) * 60 + Number(minutes)
	return Math.floor((attendanceTimeInMinutes / 60) * price)
}

async function getPrice(context) {
	const { value: price } = await context.model.data.findOne({
		key: 'pricePerHour',
	})
	return price
}

function getAttendanceMinutes(attendance) {
	const { hours, minutes } = duration(attendance.start, attendance.end)
	return Number(hours) * 60 + Number(minutes)
}

function remainingBalanceAfterPass(passOwned, attendance, price) {
	const attendanceMinutes = getAttendanceMinutes(attendance)
	const passOwnedTimeInMinutes = Number(passOwned.pass.hoursPerDay) * 60

	const timeNotCoveredByPass = attendanceMinutes - passOwnedTimeInMinutes

	const balance =
		timeNotCoveredByPass > 0
			? Math.floor((Math.abs(timeNotCoveredByPass) / 60) * price)
			: 0
	return balance
}

async function usePassOwned(context, passOwned, attendance) {
	const price = await getPrice(context)

	if (!passOwned.isActive) {
		return { passUsed: false }
	} else {
		// caculate balance remaining after using hours from pass
		const balance = remainingBalanceAfterPass(passOwned, attendance, price)

		// check days used and expiration date
		const lastDay = passOwned.daysUsed === passOwned.pass.totalDays - 1
		const expired =
			passOwned.expirationDate.toDateString() === new Date().toDateString()

		// update daysUsed in passOwned
		const usedPassOwned = await updateResolver(
			'passOwned',
			{
				id: passOwned._id,
				daysUsed: passOwned.daysUsed + 1,
				isActive: !lastDay && !expired,
			},
			context,
		)
		return { passUsed: usedPassOwned, balance }
	}
}

function timeFromNow(number, period) {
	const start = DateTime.local()
		.startOf(period)
		.plus({ [`${period}s`]: -number || 0 })
	const end = DateTime.local()
		.endOf(period)
		.plus({ [`${period}s`]: -number || 0 })
	return { start, end }
}

function totalDuration(attendancesArray) {
	const durations = attendancesArray.map(att => {
		return duration(att.start, att.end)
	})
	const sum = durations.reduce((sum, dur) => {
		Duration.fromObject(dur)
		return sum.plus(dur)
	}, Duration.fromObject({}))
	return sum.normalize().toObject()
}

export default {
	updateResolver,
	deleteResolver,
	totalDuration,
	timeFromNow,
	daysBetween,
	duration,
	balance,
	getPrice,
	getAttendanceMinutes,
	remainingBalanceAfterPass,
	usePassOwned,
	remainingBalanceAfterPass,
	timeFromNow,
	totalDuration,
}

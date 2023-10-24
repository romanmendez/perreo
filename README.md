# Perreo API

## Introduction

A GraphQL back-end for managing dog daycares.

## Installation

```bash
git clone https://github.com/romanmendez/perreo.git
cd perreo
npm install
npm start
```

## DB Structure

Owners
The owners of the dogs. Owners consist of basic contact information and an array of dog objects.

```javascript
  {
        "id": "65319388bdb89fec1c3c13ef",
        "firstName": "Mariano",
        "lastName": "Valle Nava",
        "email": "Alfredo43@hotmail.com",
        "phone": [
          "995 222 197"
        ],
        "dni": "99267886Y",
        "dogs": [
          {
            "id": "65319388bdb89fec1c3c1420"
          },
          {
            "id": "65319388bdb89fec1c3c1421"
          }
        ],
        "isActive": true
      }
```

Dogs
Dogs are the center piece of the data structure. They are the largest object, holding all relevant information for the proper functioning of a daycare. Attendances, PassesOwned and Owners are all properties of the dog object. There’s also a notes property that can be configured with any key and value pair.

```javascript
  {
        "id": "6537938c9f8d9f791057e5f1",
        "name": "Margarita",
        "breed": "Parson Russell Terrier",
        "sex": "male",
        "dateOfBirth": "2017-07-06T20:19:59.016Z",
        "isFixed": false,
        "lastHeat": "2020-02-08T22:47:00.512Z",
        "vaccines": [
          {
            "name": "parvovirus",
            "dateAdministered": "2018-10-17T14:56:56.813Z",
            "nextDue": "2024-03-22T09:26:40.766Z"
          },
          {
            "name": "distemper",
            "dateAdministered": "2018-02-18T15:22:00.375Z",
            "nextDue": "2024-04-06T15:37:10.541Z"
          },
          {
            "name": "multipurpose",
            "dateAdministered": "2021-07-26T08:31:08.063Z",
            "nextDue": "2024-06-10T02:40:18.607Z"
          },
          {
            "name": "rabies",
            "dateAdministered": "2017-10-01T20:49:55.704Z",
            "nextDue": "2023-12-05T05:42:19.128Z"
          }
        ],
        "chip": "3426586836",
        "scan": "877548127181757",
        "owners": [
          {
            "id": "6537938c9f8d9f791057e5c0"
          }
        ],
        "passes": [
          {
            "id": "6537938c9f8d9f791057e5dd",
            "isActive": true
          },
          {
            "id": "6537938c9f8d9f791057e5d7",
            "isActive": false
          },
          {
            "id": "6537938c9f8d9f791057e5d6",
            "isActive": false
          }
        ],
        "notes": [
          {
            "key": "Amarillo",
            "value": "Tondeo absconditus cinis iste correptius cupiditas.",
            "isActive": true
          }
        ]
      }
```

Attendance
The next most important part of the database is the attendance. This is the object we use to hold the start and end time of each dog’s attendance to the daycare, along with the calculated billing amount and the payment method used.

```javascript
  {
        "id": "6537a0ccc90771b9197fe31d",
        "dog": {
          "id": "6537a044424e8f55e2e61efa",
          "name": "Alejandro"
        },
        "startTime": "2023-10-24T10:47:40.055Z",
        "endTime": "2023-10-24T06:47:41.850Z",
        "totalTime": "04h 00m",
        "passUsed": {
          "id": "6537a044424e8f55e2e61eea"
        },
        "payment": null,
        "balance": 0,
        "notes": [
          {
            key: "Orange",
            value: "Some text"
          }
        ]
      }
```

Pass
The object used to store the different types of passes the daycare offers to its customers. When creating a pass type the user has three different ways of declaring when the pass has been used and no longer valid.

- totalDays: the number of days the pass can be used before becoming invalid.
- daysToExpiration: the number of days from the purchase date until the pass becomes invalid, regardless of the days used.
- hybrid: a combination of both the above options. If totalDays is reached before daysToExpiration, the pass will become inactive, and vice versa.

```javascript
"passes": [
      {
        "id": "6537a043424e8f55e2e61ed4",
        "name": "Monthly Full Time",
        "totalDays": 30,
        "daysToExpiration": 30,
        "hoursPerDay": 8,
        "price": 200,
        "isActive": true
      }
]
```

PassOwned
When an owner purchases a pasa for their dog a PassOwned entry is created with the type of pass that was purchased, a startDate that defaults to the date of the purchase if not specified, and the two variables that keep track of the when the pass is no longer valid: daysUsed and expirationDate.

```javascript
"passesOwned": [
      {
        "id": "6537a044424e8f55e2e61edd",
        "pass": {
          "id": "6537a043424e8f55e2e61ed6",
          "name": "10 dias Jornada Completa"
        },
        "daysUsed": 3,
        "startDate": "2022-12-07T17:10:27.267Z",
        "expirationDate": "2023-01-06T17:10:27.267Z",
        "isActive": false
      }
]
```

## Features

Manage Vaccines: Keep track of all your dog's vaccines.
Dog Walks: Organize and schedule dog walks with ease.
Owner Profiles: Maintain detailed owner profiles.

import mongoose from "mongoose";

const dbUrl = process.env.DBURL_REMOTE || "mongodb://localhost:27017";

export default mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`,
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

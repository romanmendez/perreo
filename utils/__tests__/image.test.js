const { uploadProfilePic } = require("..");

test("mkdir with fs", () => {
  const img =
    "/Users/romanmendez/Dropbox/My Mac (Román’s MacBook Pro)/Downloads/2013-09-15 12.54.18 2.jpeg";
  const dogId = "5fe4ece11eeefc2faf284f24";
  const res = uploadProfilePic(img, dogId);
  console.log(res);
});

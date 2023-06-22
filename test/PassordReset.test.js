const request = require("supertest");
const baseURL = "http://localhost:5000";
const UserPasswordTokenModel = require("../Users/Model/UserPasswordToken");
const UserModal = require("../Users/Model/UserModel");

// describe("API TEST FOR PASSWORD REST", () => {
//   let token;
//   beforeAll(async () => {
//     const credential = {
//       email: "mom80@gmail.com",
//       password: "Hashpassword@42",
//     };
//
//     const response = await request(baseURL)
//       .post("/v3/api/user/signin")
//       .send(credential);
//     token = response.body.token;
//   });
//
//   it("should return 401 for jwt_token not send", async () => {
//     const response = await request(baseURL)
//       .post("/v3/api/user/reset/password/request")
//       .send({ current_email: "sdkfjsdlkjfdsl@gmail.com" });
//     expect(response.statusCode).toBe(401);
//   });
//
//   test("should return 400 if the email not found", async () => {
//     const response = await request(baseURL)
//       .post("/v3/api/user/reset/password/request")
//       .send({ current_email: "sdkfjsdlkjfdsl@gmail.com" })
//       .set("Cookie", `token_dev=${token}`);
//
//     expect(response.status).toBe(400);
//   });
//
//   test("should return 200 if the email is found in db", async () => {
//     const response = await request(baseURL)
//       .post("/v3/api/user/reset/password/request")
//       .send({ current_email: "mom80@gmail.com" })
//       .set("Cookie", `token_dev=${token}`);
//
//     expect(response.status).toBe(400);
//   });
//});

describe("Reset Password API", () => {
  describe("POST /v3/api/user/reset/password/request", () => {
    let token;
    beforeAll(async () => {
      const credential = {
        email: "mom80@gmail.com",
        password: "Hashpassword@42",
      };

      const response = await request(baseURL)
        .post("/v3/api/user/signin")
        .send(credential);
      token = response.body.token;
    });

    it("should return 400 if the reset token is already generated", async () => {
      const user = await UserModal.findOne({ email: "mom80@gmail.com" });
      const userId = user._id;

      // Mock the UserPasswordTokenModel.find method to return a non-empty array

      jest
        .spyOn(UserPasswordTokenModel, "find")
        .mockResolvedValueOnce(Promise.resolve([{ user_id: userId }]));

      const response = await request(baseURL)
        .post("/v3/api/user/reset/password/request")
        .send({ current_email: "mom80@gmail.com" })
        .set("Cookie", `token_dev=${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Password reset link has already been sent to your email."
      );

      // Restore the original implementation of UserPasswordTokenModel.find
      UserPasswordTokenModel.find.mockRestore();
    });

    it("should return 200 if the reset token is not generated", async () => {
      // Mock the UserPasswordTokenModel.find method to return an empty array
      jest.spyOn(UserPasswordTokenModel, "find").mockResolvedValue([]);

      const response = await request(baseURL)
        .post("/v3/api/user/reset/password/request")
        .send({ current_email: "mom80@gmail.com" })
        .set("Cookie", `token_dev=${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Reset password link has been sent to your email mom80@gmail.com."
      );

      // Restore the original implementation of UserPasswordTokenModel.find
      UserPasswordTokenModel.find.mockRestore();
    });
  });
});

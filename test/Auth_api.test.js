const request = require("supertest");
const baseURL = "http://localhost:5000";
const randomEmail = require("random-email");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mongoose = require("mongoose");
const responseTime = require("response-time");

jest.mock("jsonwebtoken");
jest.mock("fs");
jest.mock("mongoose");

describe("POST Signup Endpoint test", () => {
  afterEach(jest.clearAllMocks);

  it("should return 400 for a invalid signup request", async () => {
    const new_user = null;
    const response = await request(baseURL)
      .post("/v3/api/user/signup")
      .send(new_user);
    expect(response.statusCode).toBe(400);
  });

  test("should return 400 for weak password", async () => {
    const new_user = {
      firstName: "designer",
      lastName: "momssdf",
      email: randomEmail({ domain: "gmail.com" }),
      password: "Hashpassword",
      confirmpassword: "Hashpassword",
    };
    const response = await request(baseURL)
      .post("/v3/api/user/signup")
      .send(new_user);
    expect(response.statusCode).toBe(400);
  });

  test("should return 400 for password did not match", async () => {
    const new_user = {
      firstName: "designer",
      lastName: "momssdf",
      email: randomEmail({ domain: "gmail.com" }),
      password: "Hashpassword(40!",
      confirmpassword: "Hashpassword#43&",
    };
    const response = await request(baseURL)
      .post("/v3/api/user/signup")
      .send(new_user);
    expect(response.statusCode).toBe(400);
  });

  test("should return 400 for duplicate email", async () => {
    const new_user = {
      firstName: "designer",
      lastName: "momssdf",
      email: "mom80@gmail.com", // duplicate email
      password: "Hashpassword(40!",
      confirmpassword: "Hashpassword#43&",
    };
    const response = await request(baseURL)
      .post("/v3/api/user/signup")
      .send(new_user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 200 if signup is valid", async () => {
    const new_user = {
      firstName: "designer",
      lastName: "momssdf",
      email: randomEmail({ domain: "gmail.com" }),
      password: "Hashpassword@42",
      confirmpassword: "Hashpassword@42",
    };
    const response = await request(baseURL)
      .post("/v3/api/user/signup")
      .send(new_user);
    expect(response.statusCode).toBe(200);
  });
});

describe("API endpoints test for signin", () => {
  afterEach(jest.clearAllMocks);
  test("should return 400 if credential not provide", async () => {
    const credential = null;
    const response = await request(baseURL)
      .post("/v3/api/user/signin")
      .send(credential);
    expect(response.statusCode).toBe(400);
  });

  test("should return 400 if the email is not found", async () => {
    const credential = {
      email: "test34@gmail.com",
      password: "skdjflsdjfklsdf",
    };
    const response = await request(baseURL)
      .post("/v3/api/user/signin")
      .send(credential);
    expect(response.statusCode).toBe(400);
  });

  test("should return 400 if the credential is not valid", async () => {
    const credential = {
      email: "mom80@gmail.com",
      password: "skdjflsdjfklsdf",
    };
    const response = await request(baseURL)
      .post("/v3/api/user/signin")
      .send(credential);
    expect(response.statusCode).toBe(400);
  });

  test("should return 200 if the credential is valid", async () => {
    const credential = {
      email: "mom80@gmail.com",
      password: "Hashpassword@42",
    };

    const response = await request(baseURL)
      .post("/v3/api/user/signin")
      .send(credential);
    expect(response.get("Set-Cookie")).toBeDefined();
    expect(response.body.data).toBe("Login Successfull.");
    expect(response.body.token).toBeDefined();
    expect(response.statusCode).toBe(200);

    // verify jwt token
    fs.readFile("./public.pem", "utf8", async (err, data) => {
      if (!err) {
        const verify_option = {
          expiresIn: "10d",
          algorithm: ["ES256"],
        };
        const verify_token = jwt.verify(
          response.body.token,
          data,
          verify_option
        );
        expect(verify_token).toBeDefined();
      }
    });
    expect(fs.readFile).toHaveBeenCalledTimes(1);
  });
});

describe("Test Logout Api", () => {
  afterEach(jest.clearAllMocks);

  test("should return 401 if the jwt_token is not found", async () => {
    const response = await request(baseURL).get("/v3/api/user/logout");
    expect(response.statusCode).toBe(401);
  });

  test("should return 401 if the jwt_token is invalid", async () => {
    const response = await request(baseURL)
      .get("/v3/api/user/logout")
      .set("Cookie", "token_dev=sdfjsldkfjslfdj");
    expect(response.statusCode).toBe(401);
  });

  test("should return 200 if the jwt_token is valid", async () => {
    const payload = {
      id: new mongoose.Types.ObjectId(),
      email: "mom80@gmail.com",
      name: "desginer hai ham",
    };
    const sign_option = { expiresIn: "10d", algorithm: ["ES256"] };
    fs.readFile("./private.ec.key", "utf8", async (err, data) => {
      if (!err) {
        const token = jwt.sign(payload, data, sign_option);
        const response = await request(baseURL)
          .get("/v3/api/user/logout")
          .set("Cookie", `token_dev=${token}`);
        expect(response.statusCode).toBe(200);
      }
    });
  });
});

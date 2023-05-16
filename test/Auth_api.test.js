const request = require("supertest");
const baseURL = "http://localhost:5000";

describe("POST Sigupn Endpoint test", () => {
  afterAll(async () => {
    await request(baseURL).post("/v3/api/user/signup");
  });

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
      email: "mom760@gmail.com",
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
      email: "mom362@gmail.com",
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
      email: "momdesire@gmail.com", // change the email when run 
      password: "Hashpassword@42",
      confirmpassword: "Hashpassword@42",
    };
    const response = await request(baseURL)
      .post("/v3/api/user/signup")
      .send(new_user);
    expect(response.statusCode).toBe(200);
  });
});

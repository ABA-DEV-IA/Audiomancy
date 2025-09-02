import { login, register, modify } from "@/services/userService"; // chemin à adapter
import { User } from "@/types/user";

describe("User API helpers", () => {
  const mockUser: User = { id: "1", email: "test@test.com", username: "tester" } as User;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("login retourne un User en cas de succès", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", user: mockUser }),
    });

    const user = await login("test@test.com", "password");
    expect(user).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith("/api/user/proxyLogin", expect.any(Object));
  });

  it("register retourne un User en cas de succès", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", user: mockUser }),
    });

    const user = await register("test@test.com", "tester", "password");
    expect(user).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith("/api/user/proxyCreate", expect.any(Object));
  });

  it("modify retourne un User en cas de succès", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", user: mockUser }),
    });

    const user = await modify("1", "tester", "password");
    expect(user).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith("/api/user/proxyModify", expect.any(Object));
  });

  it("login lève une erreur si fetch renvoie !ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    await expect(login("wrong@test.com", "badpass")).rejects.toEqual({ error: "Invalid credentials" });
  });

  it("register lève une erreur si fetch renvoie !ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Email already exists" }),
    });

    await expect(register("test@test.com", "tester", "password")).rejects.toEqual({ error: "Email already exists" });
  });

  it("modify lève une erreur si fetch renvoie !ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "User not found" }),
    });

    await expect(modify("1", "tester", "password")).rejects.toEqual({ error: "User not found" });
  });
});

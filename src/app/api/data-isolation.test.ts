import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getApiUserId: vi.fn(),
  progressFindMany: vi.fn(),
  progressUpsert: vi.fn(),
  notesFindMany: vi.fn(),
  notesCreate: vi.fn(),
  notesDeleteMany: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ getApiUserId: mocks.getApiUserId }));
vi.mock("@/lib/db", () => ({
  getDb: () => ({
    studyProgress: { findMany: mocks.progressFindMany, upsert: mocks.progressUpsert },
    note: { findMany: mocks.notesFindMany, create: mocks.notesCreate, deleteMany: mocks.notesDeleteMany },
  }),
}));

import { GET as getProgress, POST as setProgress } from "./progress/route";
import { DELETE as deleteNote, GET as getNotes, POST as createNote } from "./notes/route";

function request(url: string, method: string, body?: unknown) {
  return new NextRequest(url, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("personal API data isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getApiUserId.mockResolvedValue("github-user-42");
    mocks.progressFindMany.mockResolvedValue([]);
    mocks.progressUpsert.mockResolvedValue({ itemType: "PROMPT", itemId: "P5", status: "DONE" });
    mocks.notesFindMany.mockResolvedValue([]);
    mocks.notesCreate.mockResolvedValue({ id: "note-1", content: "Minha nota" });
    mocks.notesDeleteMany.mockResolvedValue({ count: 1 });
  });

  it("scopes progress reads to the authenticated identity", async () => {
    const response = await getProgress();
    expect(response.status).toBe(200);
    expect(mocks.progressFindMany).toHaveBeenCalledWith({
      where: { userId: "github-user-42" },
      orderBy: { updatedAt: "desc" },
    });
  });

  it("ignores a client-supplied owner when saving progress", async () => {
    const response = await setProgress(request("http://local/api/progress", "POST", {
      itemType: "PROMPT", itemId: "P5", status: "DONE", userId: "someone-else",
    }));
    expect(response.status).toBe(200);
    expect(mocks.progressUpsert).toHaveBeenCalledWith({
      where: { userId_itemType_itemId: { userId: "github-user-42", itemType: "PROMPT", itemId: "P5" } },
      update: { status: "DONE" },
      create: { userId: "github-user-42", itemType: "PROMPT", itemId: "P5", status: "DONE" },
    });
  });

  it("rejects personal API access when authentication is required", async () => {
    mocks.getApiUserId.mockResolvedValue(null);
    const response = await getProgress();
    expect(response.status).toBe(401);
    expect(mocks.progressFindMany).not.toHaveBeenCalled();
  });

  it("scopes note reads and deletions to the authenticated identity", async () => {
    const response = await getNotes(new NextRequest("http://local/api/notes?itemType=PROMPT&itemId=P5"));
    expect(response.status).toBe(200);
    expect(mocks.notesFindMany).toHaveBeenCalledWith({
      where: { userId: "github-user-42", itemType: "PROMPT", itemId: "P5" },
      orderBy: { createdAt: "desc" },
    });

    const deleted = await deleteNote(new NextRequest("http://local/api/notes?id=note-1", { method: "DELETE" }));
    expect(deleted.status).toBe(200);
    expect(mocks.notesDeleteMany).toHaveBeenCalledWith({ where: { id: "note-1", userId: "github-user-42" } });
  });

  it("uses the server identity when creating a note", async () => {
    const response = await createNote(request("http://local/api/notes", "POST", {
      itemType: "NEXT_PROMPT", itemId: "5.11", content: "anotação", userId: "someone-else",
    }));
    expect(response.status).toBe(201);
    expect(mocks.notesCreate).toHaveBeenCalledWith({
      data: { itemType: "NEXT_PROMPT", itemId: "5.11", content: "anotação", userId: "github-user-42" },
    });
  });
});

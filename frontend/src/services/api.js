const API_URL = "http://localhost:5000/api";

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
}

export async function getNotes(token) {
  const res = await fetch(`${API_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch notes");
  }

  return result;
}

export async function createNote(data, token) {
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create note");
  }

  return result;
}

export async function searchNotes(query, token) {
  const res = await fetch(`${API_URL}/notes/search/${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Search failed");
  }

  return result;
}

export async function updateNote(noteId, data, token) {
  const res = await fetch(`${API_URL}/notes/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update note");
  }

  return result;
}

export async function deleteNote(noteId, token) {
  const res = await fetch(`${API_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete note");
  }

  return result;
}

export async function addCollaborator(noteId, username, token) {
  const res = await fetch(`${API_URL}/notes/${noteId}/collaborators`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to add collaborator");
  }

  return result;
}

export async function removeCollaborator(noteId, collaboratorId, token) {
  const res = await fetch(
    `${API_URL}/notes/${noteId}/collaborators/${collaboratorId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to remove collaborator");
  }

  return result;
}
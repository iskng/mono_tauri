import { redirect } from "next/navigation";

export default function Page() {
  // Redirect to the chat page which handles authentication and setup
  redirect("/chat");
}

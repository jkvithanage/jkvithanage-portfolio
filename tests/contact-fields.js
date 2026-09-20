export async function fillContact(dialog) {
  await dialog.getByRole("textbox", { name: "Your Name", exact: true }).fill("Test Visitor");
  await dialog.getByRole("textbox", { name: "Email Address" }).fill("visitor@example.com");
  await dialog.getByRole("textbox", { name: "Phone Number" }).fill("0400000000");
  await dialog.getByRole("textbox", { name: "Subject" }).fill("Portfolio inquiry");
  await dialog.getByRole("textbox", { name: "Message", exact: true }).fill("This email is intercepted by Playwright.");
}

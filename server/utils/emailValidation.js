import dns from "dns/promises";

export const isEmailDomainValid = async (email) => {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
};

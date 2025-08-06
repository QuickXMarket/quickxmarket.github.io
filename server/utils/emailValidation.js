import dns from "dns/promises";

export const isEmailDomainValid = async (email, isAdmin) => {
  const domain = email.split("@")[1];
  try {
    if (isAdmin && domain !== "quickxmarket.com.ng") {
      return false;
    }
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
};

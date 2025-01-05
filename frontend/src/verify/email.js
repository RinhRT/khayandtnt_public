const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"]; 

export default function verifyEmail (email) {
    if (!email.includes("@")) return false
    
    const [_, domain] = email.split("@");
    return allowedDomains.includes(domain); 
};

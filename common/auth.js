import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword=async(password)=>{
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hash = await bcrypt.hash(password,salt);
    return hash;
};

const hashCompare=async(password,hash)=>{
    return await bcrypt.compare(password,hash);
};

const createToken= async (payload) =>{
    const token = await jwt.sign(payload,process.env.JWT_SECRET_KEY,{ expiresIn:process.env.JWT_EXP});
    return token;
};

const decodeToken = async(token)=>{
    const payload=await jwt.decode(token);
    return payload;
};

export default{
    hashPassword,
    hashCompare,
    createToken,
    decodeToken,
};
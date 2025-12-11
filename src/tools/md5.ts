import MD5 from "crypto-js/md5";

/**
 * 返回字符串的md5值
 * @param {string} str - 最小值
 * @returns {string} 返回值
 */
export const md5 = (str: string): string => MD5(str).toString();

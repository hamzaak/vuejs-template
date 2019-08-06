let BASE_URL = "http://localhost:58094/api";

const env = process.env.NODE_ENV.trim();

if (env === "production") {
  BASE_URL = "http://localhost:8888/api";
} else if (env === "mock") {
  BASE_URL = "";
}

console.log(`%cENV: ${env}`, 'background: #222; color: #bada55');
console.log(`%cBASE_URL: ${BASE_URL}`, 'background: #222; color: #bada55');

export { BASE_URL };

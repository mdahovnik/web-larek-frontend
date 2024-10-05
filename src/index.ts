import './scss/styles.scss';
import { Api } from "./components/base/api";
import { API_URL, CDN_URL, settings } from "./utils/constants";

const api = new Api(API_URL);
const result = api.get('/product/');


console.log(result)
console.log(api.get('/product/854cef69-976d-4c2a-a18c-2aa45046c390'));


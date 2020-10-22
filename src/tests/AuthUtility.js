import { getInstance, onAuth } from '@bcwdev/auth0-vue';

export async function SetAuth(request) {
  let authInstance = getInstance();
  if (authInstance && authInstance.bearer) {
    request.defaults.headers.Authorization = authInstance.bearer;
  } else {
    onAuth(async instance => {
      request.defaults.headers.Authorization = instance.bearer;
      await request.get("https://localhost:5001/api/profile")
    });
  }
}

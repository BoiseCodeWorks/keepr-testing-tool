import { getInstance, onAuth } from "@bcwdev/auth0-vue";

export function SetAuth(request) {
  let authInstance = getInstance();
  if (authInstance) {
    request.defaults.headers.Authorization = authInstance.bearer;
  } else {
    onAuth(instance => {
      request.defaults.headers.Authorization = instance.bearer;
    });
  }
}

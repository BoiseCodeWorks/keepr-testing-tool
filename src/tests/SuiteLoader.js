import { VaultsSuite } from "./Vaults.test";
import { KeepsSuite } from "./Keeps.test";
import { UsersSuite } from "./Auth.test";

export const loadTests = () => {
  new VaultsSuite();
  new KeepsSuite();
  new UsersSuite();
};

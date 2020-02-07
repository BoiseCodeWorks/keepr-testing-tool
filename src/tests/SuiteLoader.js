import { VaultsSuite } from "./Vaults.test";
import { KeepsSuite } from "./Keeps.test";
import { VaultKeepsSuite } from './VaultKeeps.test';
import { UsersSuite } from "./Auth.test";

export const loadTests = () => {
  new KeepsSuite();
  new VaultsSuite();
  new VaultKeepsSuite();
  new UsersSuite();
};

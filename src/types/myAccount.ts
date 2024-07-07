import {UserAccount} from "./userAccount.ts";

interface MyAccount extends UserAccount {
    first_name: string;
    last_name: string;
    email: string;
    hasTwoFactorEnabled: boolean;
    permissions: string[];
}

export type { MyAccount };
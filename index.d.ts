/**
 * Created by user on 2017/7/12/012.
 */
/**
 * get Firefox Data dir
 *
 * @see https://github.com/saadtazi/firefox-profile-js/blob/5c4a98f6e2977a2efc10afaecf1f86d621b7f069/lib/profile_finder.js
 */
export declare function os_appdata(platform?: string, env?: IEnv): string;
/**
 * parse firefox profile ini
 */
export declare function os_profile_ini(platform?: string, env?: IEnv): IFirefoxProfilesIni;
/**
 * get profile list from profile.ini
 */
export declare function os_profile_list(platform?: string, env?: IEnv): IReturnMapList;
/**
 * get profile list by search profile dir
 *
 */
export declare function os_profile_list2(platform?: string, env?: IEnv): IReturnMapList;
/**
 * get profile list from PortableApps env
 * only for windows system
 */
export declare function pa_profile_list(env?: IEnv): IReturnMapList;
export declare type IEnv = typeof process.env & {
    HOME?: string;
    USERPROFILE?: string;
    'PAL:PortableAppsBaseDir'?: string;
};
export interface IReturnMapList {
    [k: string]: string;
}
export interface IFirefoxProfilesIni {
    General: {
        StartWithLastProfile: EnumTrueFalseNumber;
        [key: string]: any;
    };
    [key: string]: any | IFirefoxProfilesIniItem;
}
export interface IFirefoxProfilesIniItem {
    Name: string;
    IsRelative: EnumTrueFalseNumber;
    Path: string;
}
export declare const enum EnumTrueFalseNumber {
    FALSE = 0,
    TRUE = 1
}
declare const _default: typeof import(".");
export default _default;

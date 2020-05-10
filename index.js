/**
 * Created by user on 2017/7/12/012.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumTrueFalseString = exports.EnumTrueFalseNumber = exports.pa_profile_list = exports.os_profile_list2 = exports.os_profile_list = exports.os_profile_ini = exports.os_appdata = void 0;
const upath_1 = require("upath");
const fs_1 = require("fs");
const ini_1 = require("ini");
/**
 * get Firefox Data dir
 *
 * @see https://github.com/saadtazi/firefox-profile-js/blob/5c4a98f6e2977a2efc10afaecf1f86d621b7f069/lib/profile_finder.js
 */
function os_appdata(platform = process.platform, env = process.env) {
    let profiledir = null;
    switch (platform) {
        case 'darwin':
            profiledir = upath_1.join(env.HOME, 'Library/Application Support/Firefox');
            break;
        case 'linux':
            profiledir = upath_1.join(env.HOME, '.mozilla/firefox');
            break;
        case 'win32':
        default:
            if (!env.APPDATA) {
                env.APPDATA = upath_1.join(env.HOME || env.USERPROFILE, 'AppData/Roaming');
            }
            profiledir = upath_1.join(env.APPDATA, 'Mozilla/Firefox');
            break;
    }
    return profiledir;
}
exports.os_appdata = os_appdata;
/**
 * parse firefox profile ini
 */
function os_profile_ini(platform = process.platform, env = process.env) {
    let basedir = os_appdata(platform, env);
    let profiles = fs_1.readFileSync(upath_1.join(basedir, 'profiles.ini'));
    return ini_1.parse(profiles.toString());
}
exports.os_profile_ini = os_profile_ini;
/**
 * get profile list from profile.ini
 */
function os_profile_list(platform = process.platform, env = process.env) {
    let basedir = os_appdata(platform, env);
    let profile = os_profile_ini(platform, env);
    return Object.keys(profile)
        .reduce((a, b) => {
        let dir = profile[b].Path;
        if (/^Profile(\d+)$/.test(b) && dir) {
            // some profile has same name, so use dir name
            let name = upath_1.basename(dir);
            if (profile[b].IsRelative) {
                dir = upath_1.join(basedir, dir);
            }
            a[name] = dir;
        }
        return a;
    }, {});
}
exports.os_profile_list = os_profile_list;
/**
 * get profile list by search profile dir
 *
 */
function os_profile_list2(platform = process.platform, env = process.env) {
    let basedir = os_appdata(platform, env);
    basedir = upath_1.join(basedir, 'Profiles');
    let ls = fs_1.readdirSync(basedir);
    return ls.reduce((a, b) => {
        let dir = upath_1.join(basedir, b);
        try {
            let stat = fs_1.statSync(dir);
            if (stat.isDirectory()) {
                a[b] = dir;
            }
        }
        catch (e) {
            if (e.code == 'ENOENT') {
                //console.error(e);
            }
            else {
                throw e;
            }
        }
        return a;
    }, {});
}
exports.os_profile_list2 = os_profile_list2;
/**
 * get profile list from PortableApps env
 * only for windows system
 */
function pa_profile_list(env = process.env) {
    //console.log(env['PAL:PortableAppsBaseDir']);
    if (env['PAL:PortableAppsBaseDir']) {
        let basedir = upath_1.join(env['PAL:PortableAppsBaseDir'], 'PortableApps');
        let ls = fs_1.readdirSync(basedir);
        if (ls) {
            return ls.reduce((a, b) => {
                let dir = upath_1.join(basedir, b, 'Data/profile');
                if (/^Firefox(.*)?Portable/i.test(b)) {
                    try {
                        let stat = fs_1.statSync(dir);
                        if (stat.isDirectory()) {
                            a[b] = dir;
                        }
                    }
                    catch (e) {
                        if (e.code == 'ENOENT') {
                            //console.error(e);
                        }
                        else {
                            throw e;
                        }
                    }
                }
                return a;
            }, {});
        }
    }
    return null;
}
exports.pa_profile_list = pa_profile_list;
var EnumTrueFalseNumber;
(function (EnumTrueFalseNumber) {
    EnumTrueFalseNumber[EnumTrueFalseNumber["FALSE"] = 0] = "FALSE";
    EnumTrueFalseNumber[EnumTrueFalseNumber["TRUE"] = 1] = "TRUE";
})(EnumTrueFalseNumber = exports.EnumTrueFalseNumber || (exports.EnumTrueFalseNumber = {}));
var EnumTrueFalseString;
(function (EnumTrueFalseString) {
    EnumTrueFalseString["FALSE"] = "0";
    EnumTrueFalseString["TRUE"] = "1";
})(EnumTrueFalseString = exports.EnumTrueFalseString || (exports.EnumTrueFalseString = {}));
exports.default = exports;
//# sourceMappingURL=index.js.map
/**
 * Created by user on 2017/7/12/012.
 */

'use strict';

import path = require('upath');
import fs = require('fs');
import ini  = require('ini');

/**
 * get Firefox Data dir
 *
 * @see https://github.com/saadtazi/firefox-profile-js/blob/5c4a98f6e2977a2efc10afaecf1f86d621b7f069/lib/profile_finder.js
 */
export function os_appdata(platform: string = process.platform, env: IEnv = process.env)
{
	let profiledir: string = null;

	switch (platform)
	{
		case 'darwin':
			profiledir = path.join(env.HOME, 'Library/Application Support/Firefox');
			break;
		case 'linux':
			profiledir = path.join(env.HOME, '.mozilla/firefox');
			break;
		case 'win32':
		default:

			if (!env.APPDATA)
			{
				env.APPDATA = path.join(env.HOME || env.USERPROFILE, 'AppData/Roaming');
			}

			profiledir = path.join(env.APPDATA, 'Mozilla/Firefox');
			break;
	}

	return profiledir;
}

/**
 * parse firefox profile ini
 */
export function os_profile_ini(platform: string = process.platform, env: IEnv = process.env)
{
	let basedir = os_appdata(platform, env);

	let profiles = fs.readFileSync(path.join(basedir, 'profiles.ini'));
	return ini.parse(profiles.toString()) as IFirefoxProfilesIni;
}

/**
 * get profile list from profile.ini
 */
export function os_profile_list(platform: string = process.platform, env: IEnv = process.env): IReturnMapList
{
	let basedir = os_appdata(platform, env);
	let profile = os_profile_ini(platform, env);

	return Object.keys(profile)
		.reduce((a, b) =>
		{
			let dir: string = profile[b].Path;

			if (/^Profile(\d+)$/.test(b) && dir)
			{
				// some profile has same name, so use dir name
				let name = path.basename(dir);

				if (profile[b].IsRelative)
				{
					dir = path.join(basedir, dir)
				}

				a[name] = dir;
			}

			return a;
		}, {} as IReturnMapList)
	;
}

/**
 * get profile list by search profile dir
 *
 */
export function os_profile_list2(platform: string = process.platform, env: IEnv = process.env): IReturnMapList
{
	let basedir = os_appdata(platform, env);

	basedir = path.join(basedir, 'Profiles');

	let ls = fs.readdirSync(basedir);

	return ls.reduce((a, b) =>
	{
		let dir = path.join(basedir, b);

		try
		{
			let stat = fs.statSync(dir);

			if (stat.isDirectory())
			{
				a[b] = dir;
			}
		}
		catch (e)
		{
			if (e.code == 'ENOENT')
			{
				//console.error(e);
			}
			else
			{
				throw e;
			}
		}

		return a;
	}, {} as IReturnMapList);
}

/**
 * get profile list from PortableApps env
 * only for windows system
 */
export function pa_profile_list(env: IEnv = process.env): IReturnMapList
{
	//console.log(env['PAL:PortableAppsBaseDir']);

	if (env['PAL:PortableAppsBaseDir'])
	{
		let basedir = path.join(env['PAL:PortableAppsBaseDir'], 'PortableApps');
		let ls = fs.readdirSync(basedir);

		if (ls)
		{
			return ls.reduce((a, b) =>
			{
				let dir = path.join(basedir, b, 'Data/profile');

				if (/^Firefox(.*)?Portable/i.test(b))
				{
					try
					{
						let stat = fs.statSync(dir);

						if (stat.isDirectory())
						{
							a[b] = dir;
						}
					}
					catch (e)
					{
						if (e.code == 'ENOENT')
						{
							//console.error(e);
						}
						else
						{
							throw e;
						}
					}
				}

				return a;
			}, {} as IReturnMapList)
		}
	}

	return null;
}

export type IEnv = typeof process.env & {
	HOME?: string,
	USERPROFILE?: string,
	'PAL:PortableAppsBaseDir'?: string,
}

export interface IReturnMapList
{
	[k: string]: string,
}

export interface IFirefoxProfilesIni
{
	General: {
		StartWithLastProfile: EnumTrueFalseNumber,
		[key: string]: any,
	},

	[key: string]: any | IFirefoxProfilesIniItem;
}

export interface IFirefoxProfilesIniItem
{
	Name: string,
	IsRelative: EnumTrueFalseNumber,
	Path: string,
}

export const enum EnumTrueFalseNumber
{
	FALSE = 0,
	TRUE = 1
}

export default exports as typeof import('./index');

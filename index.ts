/**
 * Created by user on 2017/7/12/012.
 */

'use strict';

import { join, basename } from 'upath';
import { statSync, readdirSync, readFileSync } from 'fs';
import { parse } from 'ini';

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
			profiledir = join(env.HOME, 'Library/Application Support/Firefox');
			break;
		case 'linux':
			profiledir = join(env.HOME, '.mozilla/firefox');
			break;
		case 'win32':
		default:

			if (!env.APPDATA)
			{
				env.APPDATA = join(env.HOME || env.USERPROFILE, 'AppData/Roaming');
			}

			profiledir = join(env.APPDATA, 'Mozilla/Firefox');
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

	let profiles = readFileSync(join(basedir, 'profiles.ini'));
	return parse(profiles.toString()) as IFirefoxProfilesIni;
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
				let name = basename(dir);

				if (profile[b].IsRelative)
				{
					dir = join(basedir, dir)
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

	basedir = join(basedir, 'Profiles');

	let ls = readdirSync(basedir);

	return ls.reduce((a, b) =>
	{
		let dir = join(basedir, b);

		try
		{
			let stat = statSync(dir);

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
		let basedir = join(env['PAL:PortableAppsBaseDir'], 'PortableApps');
		let ls = readdirSync(basedir);

		if (ls)
		{
			return ls.reduce((a, b) =>
			{
				let dir = join(basedir, b, 'Data/profile');

				if (/^Firefox(.*)?Portable/i.test(b))
				{
					try
					{
						let stat = statSync(dir);

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

declare global
{
	interface ProcessEnv
	{
		HOME?: string,
		USERPROFILE?: string,
		'PAL:PortableAppsBaseDir'?: string,
	}
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
		StartWithLastProfile: IEnumTrueFalse,
		[key: string]: any,
	},

	[key: string]: any | IFirefoxProfilesIniItem;
}

export interface IFirefoxProfilesIniItem
{
	Name: string,
	IsRelative: IEnumTrueFalse,
	Path: string,
}

export type IEnumTrueFalse = EnumTrueFalseNumber | EnumTrueFalseString;

export const enum EnumTrueFalseNumber
{
	FALSE = 0,
	TRUE = 1
}

export const enum EnumTrueFalseString
{
	FALSE = '0',
	TRUE = '1'
}

export default exports as typeof import('./index');

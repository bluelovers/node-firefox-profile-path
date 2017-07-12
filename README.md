# node-firefox-profile-path
firefox profile finder

## install

`npm install firefox-profile-path`

## demo

```
const FirefoxProfilePath = require('firefox-profile-path');

console.log(FirefoxProfilePath.os_profile_list());
```

## method

os_appdata()
```
C:/Users/USER/AppData/Roaming/Mozilla/Firefox
```

os_profile_ini()
```
{ General: { StartWithLastProfile: '1' },
  Profile0:
   { Name: 'dev-edition-default',
     IsRelative: '1',
     Path: 'Profiles/7nvzy56n.dev-edition-default' },
  Profile1:
   { Name: 'default',
     IsRelative: '1',
     Path: 'Profiles/n2c9big4.default',
     Default: '1' } }
```

os_profile_list()
os_profile_list2()
```
{ '7nvzy56n.dev-edition-default': 'C:/Users/USER/AppData/Roaming/Mozilla/Firefox/Profiles/7nvzy56n.dev-edition-default',
  'n2c9big4.default': 'C:/Users/USER/AppData/Roaming/Mozilla/Firefox/Profiles/n2c9big4.default' }
```

FirefoxProfilePath.pa_profile_list()
```
{ FirefoxPortable2ndProfile: 'D:/Program Files (Portable)/PortableApps/PortableApps/FirefoxPortable2ndProfile/Data/profile',
  FirefoxTWPortable: 'D:/Program Files (Portable)/PortableApps/PortableApps/FirefoxTWPortable/Data/profile' }
```

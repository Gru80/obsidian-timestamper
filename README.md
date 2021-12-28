![release](https://img.shields.io/github/v/release/Gru80/obsidian-timestamper)
![downloads](https://img.shields.io/github/downloads/Gru80/obsidian-timestamper/total.svg)

# Time Stamper - Obsidian Plugin
Add time- or date stamps to your note:
- Two format strings can be pre-configured in the plugin settings (and inserted via command or hot-key)
- An ad-hoc customized time stamp can be inserted via a dialog (last recently used format is saved and provided as suggestion)

![TimeStamper](res/dialog.png)

Desktop as well as mobile versions of Obsidian are supported.

## Format String
The plugin uses the [dateformat node js package](https://npm.io/package/dateformat), which in turn is based on [Steven Levithan](https://stevenlevithan.com)s `dateFormat()` function.

These are the provided masks for building your very own time/date stamp:



| Mask             | Description                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `d`              | Day of the month as digits; no leading zero for single-digit days.                                                                                            |
| `dd`             | Day of the month as digits; leading zero for single-digit days.                                                                                               |
| `ddd`            | Day of the week as a three-letter abbreviation.                                                                                                               |
| `DDD`            | "Ysd", "Tdy" or "Tmw" if date lies within these three days. Else fall back to ddd.                                                                            |
| `dddd`           | Day of the week as its full name.                                                                                                                             |
| `DDDD`           | "Yesterday", "Today" or "Tomorrow" if date lies within these three days. Else fall back to dddd.                                                              |
| `m`              | Month as digits; no leading zero for single-digit months.                                                                                                     |
| `mm`             | Month as digits; leading zero for single-digit months.                                                                                                        |
| `mmm`            | Month as a three-letter abbreviation.                                                                                                                         |
| `mmmm`           | Month as its full name.                                                                                                                                       |
| `yy`             | Year as last two digits; leading zero for years less than 10.                                                                                                 |
| `yyyy`           | Year represented by four digits.                                                                                                                              |
| `h`              | Hours; no leading zero for single-digit hours (12-hour clock).                                                                                                |
| `hh`             | Hours; leading zero for single-digit hours (12-hour clock).                                                                                                   |
| `H`              | Hours; no leading zero for single-digit hours (24-hour clock).                                                                                                |
| `HH`             | Hours; leading zero for single-digit hours (24-hour clock).                                                                                                   |
| `M`              | Minutes; no leading zero for single-digit minutes.                                                                                                            |
| `MM`             | Minutes; leading zero for single-digit minutes.                                                                                                               |
| `N`              | ISO 8601 numeric representation of the day of the week.                                                                                                       |
| `o`              | GMT/UTC timezone offset, e.g. -0500 or +0230.                                                                                                                 |
| `p`              | GMT/UTC timezone offset, e.g. -05:00 or +02:30.                                                                                                               |
| `s`              | Seconds; no leading zero for single-digit seconds.                                                                                                            |
| `ss`             | Seconds; leading zero for single-digit seconds.                                                                                                               |
| `S`              | The date's ordinal suffix (st, nd, rd, or th). Works well with `d`.                                                                                           |
| `l`              | Milliseconds; gives 3 digits.                                                                                                                                 |
| `L`              | Milliseconds; gives 2 digits.                                                                                                                                 |
| `t`              | Lowercase, single-character time marker string: a or p.                                                                                                       |
| `tt`             | Lowercase, two-character time marker string: am or pm.                                                                                                        |
| `T`              | Uppercase, single-character time marker string: A or P.                                                                                                       |
| `TT`             | Uppercase, two-character time marker string: AM or PM.                                                                                                        |
| `W`              | ISO 8601 week number of the year, e.g. 4, 42                                                                                                                  |
| `WW`             | ISO 8601 week number of the year, leading zero for single-digit, e.g. 04, 42                                                                                  |
| `Z`              | US timezone abbreviation, e.g. EST or MDT. For non-US timezones, the GMT/UTC offset is returned, e.g. GMT-0500                                                |
| `'...'`, `"..."` | Literal character sequence. Surrounding quotes are removed.                                                                                                   |
| `UTC:`           | Must be the first four characters of the mask. Converts the date from local time to UTC/GMT/Zulu time before applying the mask. The "UTC:" prefix is removed. |

### Predefined Formats
These formats can be used by simply putting the value of the `Name` column in the format field: 

| Name              | Mask                           | Example                  |
| ----------------- | ------------------------------ | ------------------------ |
| `default`         | `ddd mmm dd yyyy HH:MM:ss`     | Sat Jun 09 2007 17:46:21 |
| `shortDate`       | `m/d/yy`                       | 6/9/07                   |
| `paddedShortDate` | `mm/dd/yyyy`                   | 06/09/2007               |
| `mediumDate`      | `mmm d, yyyy`                  | Jun 9, 2007              |
| `longDate`        | `mmmm d, yyyy`                 | June 9, 2007             |
| `fullDate`        | `dddd, mmmm d, yyyy`           | Saturday, June 9, 2007   |
| `shortTime`       | `h:MM TT`                      | 5:46 PM                  |
| `mediumTime`      | `h:MM:ss TT`                   | 5:46:21 PM               |
| `longTime`        | `h:MM:ss TT Z`                 | 5:46:21 PM EST           |
| `isoDate`         | `yyyy-mm-dd`                   | 2007-06-09               |
| `isoTime`         | `HH:MM:ss`                     | 17:46:21                 |
| `isoDateTime`     | `yyyy-mm-dd'T'HH:MM:sso`       | 2007-06-09T17:46:21+0700 |
| `isoUtcDateTime`  | `UTC:yyyy-mm-dd'T'HH:MM:ss'Z'` | 2007-06-09T22:46:21Z     |

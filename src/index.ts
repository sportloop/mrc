export type MRCCourseHeader = {
  version: number;
  units: string;
  description?: string;
  fileName?: string;
  ftp?: number;
  dataTypes: ["MINUTES", string];
};

export type MRCCourseData = [number, number][]; // time, dataTypes[1]

export type MRCCourseText = [number, string, number][]; // time, content, duration

export type MRCIntervalData = [number, number, string][]; // startTime, endTime, name

export type MRC = {
  courseHeader: MRCCourseHeader;
  courseData: MRCCourseData;
  courseText?: MRCCourseText;
  intervalData?: MRCIntervalData;
};

const parseNumber = (numberlike: string): number => {
  const num = parseFloat(numberlike);
  if (Number.isNaN(num)) {
    throw new TypeError(`could not parse value: ${numberlike} as an integer`);
  }
  return num;
};

// TODO(danielkov): [MODE DATA]?

const getSection = (
  raw: string,
  sectionName: string,
  required = false
): string => {
  const re = new RegExp(
    `^\\[${sectionName}\\]((.|\\n)+)\\[END ${sectionName}\\]$`,
    "m"
  );
  const parsed = re.exec(raw);
  if (!parsed) {
    if (required) {
      throw new TypeError(`section: ${sectionName} was not found`);
    }
    return undefined;
  }
  const [, value] = parsed;
  if (!value) {
    if (required) {
      throw new TypeError(`section: ${sectionName} could not be read`);
    }
    return undefined;
  }
  return value.trim();
};

const getField = (
  raw: string,
  fieldName: string,
  required = false
): string | undefined => {
  const re = new RegExp(`^${fieldName}\\s?=\\s?((.)+)$`, "m");
  const parsed = re.exec(raw);
  if (!parsed) {
    if (required) {
      throw new TypeError(`field: ${fieldName} was not specified`);
    }
    return "";
  }
  const [, value] = parsed;
  if (!value) {
    if (required) {
      throw new TypeError(`field: ${fieldName} could not be read`);
    }
    return "";
  }
  return value.trim();
};

const dataTypesRegexp = /^MINUTES\s(\w+)$/m;

const getDataTypes = (raw: string): MRCCourseHeader["dataTypes"] => {
  const parsed = dataTypesRegexp.exec(raw);
  if (!parsed) {
    throw new TypeError(
      "data types should be in the format: `MINUTES <DATA TYPE, e.g.: PERCENT>`"
    );
  }
  const [, value] = parsed;
  if (!value) {
    throw new TypeError(
      "data types should be in the format: `MINUTES <DATA TYPE, e.g.: PERCENT>`"
    );
  }
  return ["MINUTES", value];
};

const getHeader = (raw: string): MRCCourseHeader => {
  const rawHeader = getSection(raw, "COURSE HEADER", true);
  const version = parseNumber(getField(rawHeader, "VERSION", true));
  const units = getField(rawHeader, "UNITS", true);
  const description = getField(rawHeader, "DESCRIPTION");
  const fileName = getField(rawHeader, "FILE NAME");
  const dataTypes = getDataTypes(rawHeader);
  const ftpString = getField(rawHeader, "FTP");
  if (ftpString) {
    const ftp = parseNumber(ftpString);
    return {
      version,
      units,
      description,
      fileName,
      ftp,
      dataTypes,
    };
  }
  return {
    version,
    units,
    description,
    fileName,
    dataTypes,
  };
};

const getCourseData = (raw: string): MRCCourseData => {
  const rawCourseData = getSection(raw, "COURSE DATA", true);
  const lines = rawCourseData.split("\n");
  return lines.map((line) => {
    const values = line.split("\t");
    if (values.length !== 2) {
      throw new TypeError(
        `expected COURSE DATA to be in format number\tnumber, got: ${line}`
      );
    }
    const minutes = parseNumber(values[0]);
    const value = parseNumber(values[1]);

    return [minutes, value];
  });
};

const getCourseText = (raw: string): MRCCourseText => {
  const rawCourseText = getSection(raw, "COURSE TEXT");
  if (!rawCourseText) {
    return undefined;
  }
  const lines = rawCourseText.split("\n");
  return lines.map((line) => {
    const split = line.split("\t");
    return [parseNumber(split[0]), split[1], parseNumber(split[2])];
  });
};

const getIntervalData = (raw: string): MRCIntervalData => {
  const rawIntervalData = getSection(raw, "INTERVAL DATA");
  if (!rawIntervalData) {
    return undefined;
  }
  const lines = rawIntervalData.split("\n");
  return lines.map((line) => {
    const split = line.split("\t");
    return [parseNumber(split[0]), parseNumber(split[1]), split[2]];
  });
};

export const parse = (raw: string): MRC => {
  const courseHeader = getHeader(raw);
  const courseData = getCourseData(raw);
  const result: MRC = { courseHeader, courseData };
  const courseText = getCourseText(raw);
  if (courseText) {
    result.courseText = courseText;
  }
  const intervalData = getIntervalData(raw);
  if (intervalData) {
    result.intervalData = intervalData;
  }

  return result;
};

const writeNameRegexp = /[A-Z]/g;

const writeName = (name: string): string => {
  return name.replace(writeNameRegexp, (match) => ` ${match}`).toUpperCase();
};

const writeValue = ([name, value]: [string, string]): string => {
  if (Array.isArray(value)) {
    return value.join(" ");
  }
  return `${writeName(name)} = ${value}`;
};

const writePossibleNumber = (value: string | number): string => {
  return typeof value === "number" ? value.toFixed(2) : value;
};

const writeSection = <Section>([name, data]: [string, Section]): string => {
  const formattedName = writeName(name);
  const values = (Array.isArray(data)
    ? data.map((stringOrNumber) => {
        if (stringOrNumber.length > 2) {
          return stringOrNumber.map(writePossibleNumber).join("\t");
        }
        return [stringOrNumber[0].toFixed(2), stringOrNumber[1]].join("\t");
      })
    : Object.entries(data).map(writeValue)
  ).join("\n");
  return `[${formattedName}]
${values}
[END ${formattedName}]`;
};

export const stringify = (parsed: MRC): string => {
  return `${Object.entries(parsed)
    .filter(([, value]) => value)
    .map(writeSection)
    .join("\n")}\n`;
};

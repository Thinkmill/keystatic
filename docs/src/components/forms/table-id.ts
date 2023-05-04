function check(value: string, name: string) {
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing Airtable ${name} Table ID`);
    } else {
      console.warn(`Missing Airtable ${name} Table ID`);
    }
  }
}

export const GET_ACCESS_TABLE_ID =
  process.env.NEXT_PUBLIC_AIRTABLE_GET_ACCESS_TABLE_ID || "NOT_SET";
check(GET_ACCESS_TABLE_ID, "GET_ACCESS");

export const GET_NOTIFIED_TABLE_ID =
  process.env.NEXT_PUBLIC_AIRTABLE_GET_NOTIFIED_TABLE_ID || "NOT_SET";
check(GET_NOTIFIED_TABLE_ID, "GET_NOTIFIED");

export const SEND_MESSAGE_TABLE_ID =
  process.env.NEXT_PUBLIC_AIRTABLE_SEND_MESSAGE_TABLE_ID || "NOT_SET";
check(SEND_MESSAGE_TABLE_ID, "SEND_MESSAGE");

export const MAILING_LIST_TABLE_ID =
  process.env.NEXT_PUBLIC_AIRTABLE_MAILING_LIST_TABLE_ID || "NOT_SET";
check(MAILING_LIST_TABLE_ID, "MAILING_LIST");

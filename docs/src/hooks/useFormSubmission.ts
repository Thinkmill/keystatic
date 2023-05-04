import { useState } from "react";
import { useRouter } from "next/router";

const AIRTABLE_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

type Props = {
  tableId: string;
  form: HTMLFormElement;
  onSuccess?: () => void;
};

export function useFormSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const sendForm = async ({
    tableId,
    form,
    onSuccess = () => router.push("/thank-you"),
  }: Props) => {
    if (tableId === "NOT_SET") {
      alert("Airtable ID is not set, skipping form submission");
      onSuccess();
      return;
    }

    setIsLoading(true);
    // Get form data object
    const formFieldValues = Object.fromEntries(new FormData(form));

    // Submit the form to airtable
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${tableId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: formFieldValues }),
      }
    );
    if (res.ok) {
      // Happy path
      onSuccess();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      // TODO: Do something to let the user know something went wrong
      const json = await res.json();
      console.log("error submitting the form ", { json });
    }
  };

  return { sendForm, isLoading };
}

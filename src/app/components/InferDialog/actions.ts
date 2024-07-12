"use server";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

interface ErrorFormState {
  status: "error";
  message: string;
}

interface BaseFormState {
  status: "success" | "error" | "idle";
}

interface SuccessFormState extends BaseFormState {
  status: "success";
  result: z.infer<typeof resultSchema>;
}

interface IdleFormState extends BaseFormState {
  status: "idle";
}

export type FormState = SuccessFormState | ErrorFormState | IdleFormState;

const getIssuesFromCsv = async (csvText: string, labels: string) => {
  const systemContent = `You transform any csv in a set of gitlab issues. From the following text of the csv, return only an array of objects with the following format. Since it's an array, your answer must start with "[" char, and ends with "]" char.:\n\n${JSON.stringify(
    {
      title: "string",
      labels: ["string"],
      description: "string",
    }
  )}\n\nExcept the title, all other fields are optional.\n\nYou can only use for labels the following values (separated by ;): ${labels}.\nAdd new labels is not allowed. If there are not labels who represents the issue, just leave labels empty.\n\nTitles should be unique, required, brief, but representative of the issue.\n\nThe description should contain all the information that you can collect of the issue from the provided csv.\n\nTitle and description must be in english, so you should make some translations if the original text is in another language.`;

  console.log(systemContent);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: csvText,
      },
    ],
  });

  const result = completion.choices[0].message.content;

  return result;
};

const resultSchema = z.array(
  z.object({
    title: z.string().min(1),
    labels: z.array(z.string()).optional(),
    description: z.string().optional(),
  })
);

export const inferFromCsv = async (formData: FormData): Promise<FormState> => {
  const file = formData.get("file") as File;
  const labels = formData.get("labels") as string;
  const csvText = await file.text();

  let strResult: string;
  try {
    const inferResult = await getIssuesFromCsv(csvText, labels);
    if (!inferResult) {
      return {
        status: "error" as const,
        message: "The result is empty",
      };
    }
    strResult = inferResult;

    console.log(strResult);

    const openArrChar = strResult.indexOf("[");
    const closeArrChar = strResult.lastIndexOf("]");
    if (openArrChar === -1 || closeArrChar === -1) {
      return {
        status: "error" as const,
        message: "The result is not an array",
      };
    }

    strResult = strResult.slice(openArrChar, closeArrChar + 1);
  } catch (e) {
    return {
      status: "error" as const,
      message: "Something went wrong connecting with OpenAI API",
    };
  }

  let jsonResult: ReturnType<typeof JSON.parse>;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    jsonResult = JSON.parse(strResult);
  } catch (e) {
    return {
      status: "error" as const,
      message: "The result is not a valid JSON",
    };
  }

  const result = resultSchema.safeParse(jsonResult);

  if (!result.success) {
    return {
      status: "error" as const,
      message: result.error.errors
        .map((error) => `${error.path[0]} - ${error.message}`)
        .join(";"),
    };
  }

  console.log(result.data);

  return {
    status: "success" as const,
    result: result.data,
  };
};

import { useState } from "react";
import { object, string } from "zod";
import { trpc } from "../utils/trpc";

export const tweetSchema = object({
  text: string({
    required_error: 'Tweet text is required'
  }).min(10).max(280)
})

export function CreateTweet() {
  const [text, setText] = useState("");
  const [error, setError] = useState('')

  const utils = trpc.useContext()

  const { mutateAsync } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      setText('')
      utils.tweet.timeline.invalidate()
    }
  })


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await tweetSchema.parse({ text })
    } catch (err: any) {
      setError(err.message)
      return;
    }

    if (text.length < 10) {
      setError("Tweet must be at least 10 characters")
      return
    }
    mutateAsync({ text })
  }

  return (
    <>
      {error && JSON.stringify(error)}
      <form onSubmit={handleSubmit} className='flex w-full flex-col rounded-md border-2 p-4 mb-4'>
        <textarea className="p-4 shadow w-full" onChange={(e) => setText(e.target.value)} />
        <div className="mt-4 flex justify-end">
          <button className="bg-primary text-white px-4 py-2 rounded-md" type="submit">Tweet</button>
        </div>
      </form>
    </>
  )
}

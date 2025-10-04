"use client"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import SearchResults, { SearchPayload } from "./search-results"
import { spotifyQuerySchema } from "@/lib/validations";

export default function ProfileForm() {
  const [results, setResults] = useState<SearchPayload | null>(null)
  const form = useForm<z.infer<typeof spotifyQuerySchema>>({
    resolver: zodResolver(spotifyQuerySchema),
    defaultValues: {
      query: "",
    },
  })

  async function onSubmit(values: z.infer<typeof spotifyQuerySchema>) {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ query: values.query }),
      });
      const data = await res.json();
      if (data?.ok) {
        setResults(data.data);
      } else {
        setResults(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-5xl">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spotify Search</FormLabel>
                <FormControl>
                  <Input placeholder="What are you looking for?" {...field} />
                </FormControl>
                <FormDescription>
                  Type in a query to search for a song, artist, or album on Spotify.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {results ? (
        <div className="mt-10 w-full flex justify-center">
          <SearchResults data={results} />
        </div>
      ) : null}
    </>
  )
}
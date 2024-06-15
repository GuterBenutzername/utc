import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {DateTime} from "luxon";

function getSeconds(str: string) {
  let seconds = 0;
  const days = str.match(/(\d+)\s*d/);
  const hours = str.match(/(\d+)\s*h/);
  const minutes = str.match(/(\d+)\s*m/);
  if (days) { seconds += parseInt(days[1])*86400; }
  if (hours) { seconds += parseInt(hours[1])*3600; }
  if (minutes) { seconds += parseInt(minutes[1])*60; }
  return seconds;
}

function calc(input: string) {
  const lexed = input.split(/([+-])/).map(el => el.trim()).filter(el => el);
  let result = DateTime.now();
  let i=0;
  while (i < lexed.length - 1) {
    if (i == 0 && lexed[i] == "now") {
      i++;
      continue;
    }
    if (lexed[i] == "+") {
      result = result.plus({seconds: getSeconds(lexed[i+1])});
      i+=2;
      continue;
    }
  }
  return result.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
}

export default component$(() => {
  const calcInput = useSignal("");
  const calcOutput = useComputed$(() => {
    return calc(calcInput.value);
  })

  return (
    <div class="content">
      <input placeholder="now + 8 hrs" bind:value={calcInput}></input>
      <div class="results">
        <p class="result-header">&nbsp;{calcInput.value}</p>
        <p class="result">&nbsp;{calcOutput.value}</p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "utc",
  meta: [
    {
      name: "description",
      content: "the ultimate time calculator",
    },
  ],
};

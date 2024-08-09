const Tokenizer = require('../../lib/natural').SentenceTokenizer

const abbreviations = require('../../lib/natural').abbreviations
const sentenceDemarkers = ['.', '!', '?']
const tokenizer = new Tokenizer(abbreviations, sentenceDemarkers)

const testData = `Breaking News: Renewable Energy on the Rise

In recent years, the adoption of renewable energy sources has been on a significant rise. Governments around the world are investing heavily in solar, wind, and hydroelectric power to reduce their carbon footprints and combat climate change.

In the United States, the Biden administration has set ambitious goals to achieve net-zero emissions by 2050. This involves a massive shift from fossil fuels to cleaner energy sources. "We are at a pivotal moment in history," said President Biden. "Our actions today will determine the health of our planet for future generations."

Meanwhile, in Europe, the European Union has been at the forefront of renewable energy adoption. Countries like Germany and Denmark are leading the charge with substantial investments in wind farms and solar panels. The EU's Green Deal aims to make Europe the first climate-neutral continent by 2050.

China, the world's largest emitter of greenhouse gases, is also making strides in renewable energy. The country has become the largest producer of solar panels and has invested heavily in wind energy. "China is committed to a green future," said President Xi Jinping during a recent summit.

Despite these advancements, challenges remain. The transition to renewable energy requires enormous financial investments, technological innovations, and policy changes. Additionally, the intermittency of renewable sources like solar and wind poses a challenge for grid stability.

Experts believe that with continued global cooperation and investment, renewable energy can become the dominant source of power in the coming decades. "The future is bright for renewable energy," said Dr. Jane Goodall, a renowned environmentalist. "We have the technology, the resources, and the will to make this change. Now, we must act."

Stay tuned for more updates on this developing story.`

const result = tokenizer.tokenize(testData)
console.log(result)
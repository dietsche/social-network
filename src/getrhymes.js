import axios from "./axios";
import { insertRhyme } from "./chat";

export async function getRhyme(lastMessage) {
    let currentValue;
    let currentValueLastWord;
    let currentValueClean;
    let index;
    let theWordBefore;
    let nResponse;
    const sentencesWithThe = [
        "I have the",
        "It's good to have the",
        "I'd like to have the",
        "Today I've seen the",
        "I look for the",
        "I've never seen the",
        "Don't mention the",
        "I miss the",
        "I just say:",
        "I don't want the",
        "Let me just say:",
        "We've never talked about",
        "I don't want to speak about the",
        "I'm intereted in the",
        "I know everything about the",
        "Tell me more about the",
        "I don't care about the"
    ];
    const sentencesWithout = [
        "We have never talked about",
        "It's good to have",
        "By the way - I like",
        "Let's talk about",
        "Last night I dreamed of",
        "I read a book on",
        "I love",
        "I hate",
        "Can I have your",
        "I think about",
        "I've never seen",
        "I need more",
        "I don't want",
        "Don't mention",
        "Let's discuss",
        "I just say:",
        "I don't want to speak about",
        "I'm interested in",
        "I know everything about",
        "Tell me more about",
        "I don't care about"
    ];
    let randomSentence;
    let rhymedAnswer;
    console.log("click");
    currentValue = lastMessage;
    currentValueClean = currentValue.replace(
        /[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g,
        ""
    );

    console.log("currentValueClean: ", currentValueClean);

    let n = currentValueClean.split(" ");
    currentValueLastWord = n[n.length - 1];
    await axios
        .get(
            "http://api.datamuse.com/words?rel_rhy=" +
                currentValueLastWord +
                "&max=1000&md=p&lc=the"
        )
        .then(data => {
            console.log("data: ", data);

            nResponse = data.data.filter(
                item => item.tags && item.tags[0] == "n"
            );
            console.log("nResponse : ", nResponse);

            index = Math.floor(Math.random() * nResponse.length);
        })
        .then(async () => {
            await axios
                .get(
                    "http://api.datamuse.com/words?lc=" + nResponse[index].word
                )
                .then(data => {
                    console.log("datafial: ", data.data);
                    for (
                        let i = 0;
                        i < Math.floor(data.data.length * 0.5);
                        i++
                    ) {
                        console.log("SCHLEIFE", data.data[i].word);
                        if (data.data[i].word == "the") {
                            theWordBefore = "the";
                            break;
                        } else if (data.data[i].word == "a") {
                            theWordBefore = "a";
                            console.log("response[i].word", data.data[i].word);
                            break;
                        } else {
                            theWordBefore = "n";
                            console.log("response[i].word", data.data[i].word);
                        }
                        console.log("theWordBefore: ", theWordBefore);
                        if (theWordBefore == "the") {
                            let randomIndex = Math.floor(
                                Math.random() * sentencesWithThe.length
                            );
                            console.log("randomIndex: ", randomIndex);
                            console.log("sentencesWithThe: ", sentencesWithThe);
                            randomSentence = sentencesWithThe[randomIndex];
                        } else if (theWordBefore == "a") {
                            console.log("sentencesWithThe: ", sentencesWithThe);

                            randomSentence =
                                sentencesWithThe[
                                    Math.floor(
                                        Math.random() * sentencesWithThe.length
                                    )
                                ];
                        } else {
                            let randomIndex = Math.floor(
                                Math.random() * sentencesWithout.length
                            );
                            console.log("sentencesWithThe: ", sentencesWithThe);
                            console.log("randomIndex: ", randomIndex);
                            randomSentence = sentencesWithout[randomIndex];
                            console.log(
                                "SATZ: ",
                                randomSentence +
                                    " " +
                                    nResponse[index].word +
                                    "."
                            );
                            rhymedAnswer =
                                randomSentence +
                                " " +
                                nResponse[index].word +
                                ".";
                        }
                    }
                    insertRhyme(rhymedAnswer);
                });
        })
        .catch(err => {
            console.log(err);
        });
}

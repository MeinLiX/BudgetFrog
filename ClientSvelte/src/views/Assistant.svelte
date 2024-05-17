<script>
    import { ShowInfo } from "../services/Utils";
    import Request from "../services/RequestController";
    import { ErrorWrapper } from "../services/RequestWrapper";

    //{budgetID}
    export let params = {};

    let ChatHistory = [
        //{ role: "user", content: "text" },
        //{ role: "assistant", content: "answer" },
    ];
    let currentMessage = "";
    let loadingAnswer = false;
    let onSendMessage = async () => {
        try {
            if (ChatHistory.length >= 1) {
                if (ChatHistory.at(-1).role == "user") {
                    ShowInfo("Waiting response or restart session", 3000);
                    return;
                }
            }

            ChatHistory.push({ role: "user", content: currentMessage });
            ChatHistory = ChatHistory;  //update
            currentMessage = "";

            loadingAnswer = true;

            let res = (await Request.assistent.SendChatMessage(ChatHistory)).data;
            ChatHistory.push({ role: "assistant", content: res });
            ChatHistory = ChatHistory; //update

            loadingAnswer = false;
        } catch (err) {
            ErrorWrapper(err);
        }
    };
    let onRestart = () => {
        ChatHistory = [];
    };
</script>

<div class="flex flex-col h-screen">
    <main class="grow">
        {#if ChatHistory.length > 0}
            <ul
                class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical"
            >
                {#each ChatHistory as message}
                    {#if message.role == "user"}
                        <li>
                            <hr />
                            <div class="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    class="h-5 w-5"
                                    ><path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clip-rule="evenodd"
                                    /></svg
                                >
                            </div>
                            <div class="timeline-start md:text-end mb-10">
                                <time class="font-mono italic"></time>
                                <div class="text-lg font-black">You</div>
                                {message.content}
                            </div>
                            <hr />
                        </li>
                    {:else}
                        <li>
                            <hr />
                            <div class="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    class="h-5 w-5"
                                    ><path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clip-rule="evenodd"
                                    /></svg
                                >
                            </div>
                            <div class="timeline-end mb-10">
                                <time class="font-mono italic"></time>
                                <div class="text-lg font-black">
                                    Assistant BudgetFrog
                                </div>
                                {message.content}
                            </div>
                            <hr />
                        </li>
                    {/if}
                {/each}
                {#if loadingAnswer}
                     <li>
                        <hr />
                        <div class="timeline-middle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="h-5 w-5"
                                ><path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clip-rule="evenodd"
                                /></svg
                            >
                        </div>
                        <div class="timeline-end mb-10">
                            <time class="font-mono italic"></time>
                            <div class="text-lg font-black">
                                Assistant BudgetFrog
                            </div>
                            <span class="loading loading-dots loading-lg"></span>
                        </div>
                        <hr />
                    </li>
                {/if}
                <li>
                    <hr />
                    <div class="timeline-middle">
                        <span class="loading loading-ring loading-sm"></span>
                    </div>
                </li>
            </ul>
        {:else}
            <div role="alert" class="alert mt-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="stroke-info shrink-0 w-6 h-6"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path></svg
                >
                <span>Send the first message for assistant</span>
            </div>
        {/if}
    </main>
    <footer class="sticky bottom-0 z-50 bg-white">
        <div class="center_content">
            <div class="join m-1">
                <input
                    class="input input-bordered join-item"
                    placeholder="Enter message"
                    bind:value={currentMessage}
                />
                <button
                    class="btn join-item rounded-r-full"
                    on:click={onSendMessage}>Send message</button
                >
                <button
                    class="btn join-item rounded-r-full"
                    on:click={onRestart}>Restart</button
                >
            </div>
        </div>
    </footer>
</div>

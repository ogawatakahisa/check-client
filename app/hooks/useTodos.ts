// useTodoを呼び出すだけでtodoのデータが使えるようになる
// 要はロジックを分解して再利用性を高めたってこと

import useSWR from "swr";
import { API_URL } from "../constants/url";

// APIから取得する
async function fetcher(key: string) {
    return fetch(key).then((res) => res.json());
}

export const useTodos = () => {
    const { data, isLoading, error, mutate } = useSWR(
        `${API_URL}/allTodos`,
        // 引数ないように見えるけど、useSWRの仕組みで自動でつけてくれてる
        // この時の引数はuseSWRで呼び出したAPIのurlが渡される
        fetcher
    );

    return {
        todos: data,
        isLoading,
        error,
        mutate,
    }
}
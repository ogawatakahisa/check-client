import useSWR from "swr";
import { API_URL } from "../constants/url";
import { fetchAuthSession } from "@aws-amplify/auth";

/**
 * 認証されたユーザーのアクセストークンを取得し、APIからTodoデータを取得する関数
 *
 * @param {string} url - 取得するAPIのエンドポイント
 * @returns {Promise<any>} - APIレスポンスのJSONデータ
 * @throws {Error} - 認証情報が取得できない場合、またはAPIリクエストに失敗した場合
 */
async function fetcher(url: string) {
    try {
        const session = await fetchAuthSession();// 現在の認証情報を取得
        const accessToken = session.tokens?.accessToken?.toString();// アクセストークンの取得（APIリクエスト時に使用）
        
        // トークンが取得出来なければリクエスト不可のためエラー
        if (!accessToken) {
            throw new Error("No access token available");
        }

        // APIリクエストを送信
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            credentials: "include",// CORS対応: 認証情報を送るために追加
        });

        // レスポンスのステータスをチェック
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json(); 
    } catch (error) {
        console.log("Error fetching auth session:", error);
        throw error;
    }
}

/**
 * SWRを使用して選択した日付のTodoデータを取得するカスタムフック
 * 
 * @param {string} selectedDate - 取得する日付（YYYY-MM-DD）
 * @returns {Object} - Todoデータと状態管理用のフラグ
 * @returns {any}　todos return.todos - 取得したTodoリスト（配列）
 * @returns {boolean} return.isLoading - データ取得中かどうかのフラグ
 * @returns {Error | undefined} return.error - エラー情報（発生しなければ undefined）
 * @returns {Function} return.mutate - キャッシュを更新する関数
 */
export const useTodos = (selectedDate: string) => {
    const { data, isLoading, error, mutate } = useSWR(
        `${API_URL}/allTodos/${selectedDate}`,
        fetcher
    );

    return {
        todos: data,
        isLoading,
        error,
        mutate,
    };
};

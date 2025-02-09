"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// AWS関連ライブラリ
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { signOut, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css"; // AmplifyのUIスタイルを適用
import awsExports from "../aws-exports"; // AWS Amplifyの設定ファイル

// コンポーネント、カスタムフック
import Todo from "./components/Todo";
import { useTodos } from "./hooks/useTodos";

// 定数、型定義
import { API_URL } from "./constants/url";
import { TodoType } from "./types";

Amplify.configure(awsExports); //awsExportsの設定をamplifyに適用する

function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null); // ユーザー名を保存するState
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); // 初期値: 今日
  const { todos, mutate } = useTodos(selectedDate); // 選択した日付の Todo を取得

  // 認証されたユーザーの情報を取得
  useEffect(() => {
    async function checkUser() {
      try {
        const { username } = await getCurrentUser();
        setUsername(username); // ログイン済みならユーザー名をセット
      } catch (error) {
        console.error("User not logged in.", error);
      }
    }
    checkUser();

    const handleTabClose = (event: BeforeUnloadEvent) => {
      event.preventDefault(); // デフォルトの動作を防ぐ
      handleLogout(); // 閉じる前に実行する関数
    };

      window.addEventListener("beforeunload", handleTabClose);
      
      return () => {
          window.removeEventListener("beforeunload", handleTabClose);
      };
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(); // ログアウト処理
      setUsername(null); // ユーザー名をリセット
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  // タスク追加処理
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 入力値が空の場合
    if (!inputRef.current?.value.trim()) {
      alert("Todoのタイトルを入力してください");
      return;
    }

    try {
      // 認証セッションを取得し、トークンを取得
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      if (!accessToken) {
        throw new Error("No access token available");
      }

      // 新しいTodoをAPIへリクエスト
      const response = await fetch(`${API_URL}/createTodo`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}` // 認証トークン
        },
        credentials: "include", // cors対応: 認証情報をリクエストに含める
        body: JSON.stringify({
          title: inputRef.current?.value,
          isCompleted: false,
          date: selectedDate
        })
      });

      // APIレスポンスがエラーだった場合
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("APIエラー: ", errorResponse);
        throw new Error("Failed to create todo");
      }

      // Todoリストを更新し、入力フィールドをクリア
      router.refresh();
      if (response.ok) {
        const newTodo = await response.json();
        mutate([...(todos || []), newTodo]);
        inputRef.current!.value = "";
      }
    } catch (error) {
      console.error("トークン取得エラー:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4">
      <div className="px-4 py-2 flex justify-between items-center">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">To-Do List</h1>
        {username && (
          <button
            onClick={handleLogout} // ログアウト
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Logout
          </button>
        )}
      </div>

      {username && (
        <p className="text-gray-600 text-sm px-4">Welcome, {username}!</p> // ユーザー名を表示
      )}

      {/* 📅 カレンダー（選択日を変更できる） */}
      <div className="px-4 py-2">
        <label className="block text-gray-700">📅 Select Date</label>
        <input
            type="date"
            className="border rounded py-1 px-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      <form className="w-full max-w-sm mx-auto px-4 py-2" onSubmit={handlesubmit}>
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Add a task"
            ref={inputRef}
          />
          <button
            className="duration-150 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="divide-y divide-gray-200 px-4">
        {todos?.map((todo: TodoType) => (
          <Todo key={todo.id} todo={todo} selectedDate={selectedDate}  />
        ))}
      </ul>
    </div>
  );
}

export default withAuthenticator(Home); // Amplify Auth をHomeに適用

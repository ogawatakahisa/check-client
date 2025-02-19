import { useState } from "react";
import { TodoType } from "../types";
import { useTodos } from "../hooks/useTodos";
import { API_URL } from "../constants/url";
import { fetchAuthSession } from "aws-amplify/auth";


/**
 * 認証されたユーザーのアクセストークンを取得する共通関数
 *
 * @returns {Promise<string>} - 取得したアクセストークン
 * @throws {Error} - 認証情報が取得できない場合
 */
async function getAuthToken(): Promise<string> {
    try {
        const session = await fetchAuthSession();
        console.log("Fetched Auth Session:", session);
        const accessToken = session.tokens?.accessToken?.toString();
        if (!accessToken) throw new Error("No access token available");
        return accessToken;
    } catch (error) {
        console.error("トークン取得エラー:", error);
        throw error;
    }
}

// TodoコンポーネントのPropsタイプの定義
type TodoProps = {
    todo: TodoType;
    selectedDate: string;
};

/**
 * Todoリストの1つのアイテムを表示・編集・削除するコンポーネント
 *
 * @param {TodoProps} props - Todoアイテムのデータ
 * @returns {JSX.Element} - Todoコンポーネント
 */
const Todo = ({ todo, selectedDate }: TodoProps) => {
    const [isEditing, setIsEditing] = useState(false);// 編集状態の管理
    const [editedTitle, setEditedTitle] = useState<string>(todo.title);// 編集用タイトルの状態管理
    const { todos, mutate } = useTodos(selectedDate); // 選択した日付の Todo を取得

    // 編集ボタンの処理
    const handleEdit = async () => {
        setIsEditing((prev) => !prev); // 編集状態のトグルを切り替える
    
        if (isEditing) {
            try {
                const accessToken = await getAuthToken();
    
                // 編集が完了したらサーバーに更新を反映
                const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ title: editedTitle })
                });
    
                if (response.ok) {
                    // const updatedTodo = await response.json();    
                    await response.json();    
                    mutate(undefined, true);
                }
            } catch (error) {
                console.error("トークン取得エラー:", error);
            }
        }
    };
    
    
    /**
     * Todoの削除処理
     *
     * @param {number} id - 削除するTodoのid
     */
    const handleDelete = async (id: number) => {
        try {
            const accessToken = await getAuthToken();
            const response = await fetch(`${API_URL}/deleteTodo/${todo.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const updatedTodos = todos.filter((todo: TodoType) => todo.id !== id);
                mutate(updatedTodos);
            }
        }  catch (error) {
            console.error("トークン取得エラー:", error);
        }
    };
    
    /**
     * Todoの完了状態を切り替える
     *
     * @param {number} id - 更新対象のTodoのID
     * @param {boolean} isCompleted - 現在の完了状態
     */
    const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
        try {
            const accessToken = await getAuthToken();

            const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ isCompleted: !isCompleted })
            });
            console.log("todoの完了状態"+response);
            if (response.ok) {
                const editieTodo = await response.json();
                const updatedTodos = todos.map((todo: TodoType) =>
                    todo.id === editieTodo.id ? editieTodo : todo
                );
                mutate(updatedTodos);
            }
        }   catch (error) {
            console.error("トークン取得エラー:", error);
        }
    };

    return (
        <div>
            <li className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="todo1"
                            name="todo1"
                            type="checkbox"
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            checked={todo.isCompleted}
                            onChange={() => toggleTodoCompletion(todo.id, todo.isCompleted)}
                        />
                        <label className="ml-3 block text-gray-900">
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="border rounded py-1 px2"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                            ) : (
                                <span
                                    className={`text-lg font-medium mr-2 ${todo.isCompleted ? "line-through" : ""}`}
                                >
                                    {todo.title}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className={`flex items-center space-x-2`}>
                        <button
                            onClick={handleEdit}
                            className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
                        >
                            {isEditing ? "Save" : "✒"}
                        </button>
                        <button
                            onClick={() => handleDelete(todo.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
                        >
                            ✖
                        </button>
                    </div>
                </div>
            </li>
        </div>
    );
};

export default Todo;

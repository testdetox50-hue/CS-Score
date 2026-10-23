import { useCallback, useMemo, useReducer } from "react";
export type CartStatus = "draft" | "active" | "archived";

export interface CartItem {
  id: number;
  titl
    () => state.items.filter((it) => state.filter === "all" || it.status === state.filter),
    [state.items, state.filter],
  );
  const cartCount = visible.length;
  const averageScore = useMemo(
    () => (visible.length ? visible.reduce((sum, it) => sum + it.score, 0) / visible.length : 0),
    [visible],
  );

  const handleAdd = useCallback(() => {
    const id = state.nextId;
    dispatch({ type: "add", item: { id, title: `Cart #${id}`, status: "draft", score: (id * 7) % 100 } });
  }, [state.nextId]);

  return (
    <section className="cart-card" aria-label={heading}>
      <header>
        <h2>{heading}</h2>
        <p>
          {cartCount} shown, average score {averageScore.toFixed(1)}
        </p>
        <select value={state.filter} onChange={(e) => dispatch({ type: "filter", status: e.target.value as CartStatus | "all" })}>
          <option value="all">all</option>
          {ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="button" onClick={handleAdd} disabled={state.items.length >= LIMIT}>Add cart</button>
      </header>
      <ul>
        {visible.map((it) => (
          <li key={it.id} onClick={() => onSelect?.(it)}>
            <span>{it.title}</span> <em>{it.status}</em> <strong>{it.score}</strong>
            <button type="button" onClick={(e) => { e.stopPropagation(); dispatch({ type: "cycle", id: it.id }); }}>next</button>
            <button type="button" onClick={(e) => { e.stopPropagation(); dispatch({ type: "remove", id: it.id }); }}>remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CartCard;

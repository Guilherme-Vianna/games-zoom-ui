import { describe, expect, it } from "vitest";
import { summarizeAddResult } from "./add-game-result";

describe("summarizeAddResult", () => {
  it("um jogo, nada pulado", () => {
    expect(summarizeAddResult([{ title: "Hades" }], [])).toBe('"Hades" adicionado a lista.');
  });

  it("varios jogos", () => {
    expect(summarizeAddResult([{ title: "A" }, { title: "B" }], [])).toBe(
      "2 jogos adicionados a lista.",
    );
  });

  it("cita os pulados com o motivo", () => {
    expect(
      summarizeAddResult(
        [{ title: "Hades" }],
        [
          { term: "Hades", reason: "duplicate" },
          { term: "jogo inexistente", reason: "not_found" },
        ],
      ),
    ).toBe(
      '"Hades" adicionado a lista. Nao entraram: "Hades" (ja estava na lista), "jogo inexistente" (nao encontrado na Steam).',
    );
  });
});

import Link from "next/link";

interface Props {
  dark?: boolean;
}

export function InviteFooter({ dark }: Props) {
  return (
    <footer className={`py-6 text-center border-t ${dark ? "border-white/10" : ""}`}>
      <p className={`text-xs ${dark ? "text-white/30" : "text-muted-foreground"}`}>
        Dijana dengan{" "}
        <Link
          href="/"
          className={`font-medium hover:underline ${dark ? "text-white/50 hover:text-white/80" : ""}`}
        >
          KadHariLahir
        </Link>
        {" "}— Kad jemputan hari lahir digital Malaysia
      </p>
    </footer>
  );
}

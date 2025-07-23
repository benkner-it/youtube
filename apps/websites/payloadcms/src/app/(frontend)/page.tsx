
import Link from "next/link";

export default function Page() {
    return <div style={{ display: "flex", justifyContent: "space-around" }}>
        Try out one of our clients
        <Link href="/new">New</Link>
        <Link href="/holacanterasclub">Hola</Link>
    </div>
}

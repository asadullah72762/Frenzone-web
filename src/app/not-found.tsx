import Link from "next/link";
import { Container } from "@/components/layout/container";
export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link className="text-brand mt-5 inline-block" href="/creators">
        Return to Frenzone
      </Link>
    </Container>
  );
}

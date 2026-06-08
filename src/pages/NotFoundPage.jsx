import { Link } from "react-router";
export default function NotFoundPage(){
    return (
        <section>
            <h2>404: Not Found</h2>
            <Link to="/">Go Home</Link>
        </section>
    )
}
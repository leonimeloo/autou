import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from "@/middleware/mongodb";
import Rating from "@/models/Rating";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
    ) => {
    if(req.method == 'POST') {

        const { owner, destination, content, like } = req.body;

        try {
            const rating = new Rating({
                owner,
                destination,
                content,
                like
            });

            const ratingCreated = await rating.save();

            return res.status(201).json(ratingCreated);
        } catch (err) {
            console.log(err);
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}

export default connectDB(handler);
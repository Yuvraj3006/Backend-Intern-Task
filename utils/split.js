function exact_split(split_users,expense_amount){
    
        let totalExactAmount = 0;
        let splitAmounts = [];
        let splitUserNames = [];
        for(const user of split_users){
            const {username , exact_amount} = user;
            
            if(exact_amount === undefined || exact_amount < 0){
                return res.status(400).send({error : "Exact amount needs to specified greater than zero"});
            }

            totalExactAmount += exact_amount;
            splitAmounts.push(exact_amount);
            splitUserNames.push(username);
        }
        if (totalExactAmount !== expense_amount) {
            return res.status(400).send({ error: "The total of exact amounts must match the total expense amount." });
        }
        return {splitAmounts,splitUserNames};
   
}

function equal_split(split_users,expense_amount){
    const equalAmount = expense_amount / split_users.length; 
    let splitAmounts = [];
    let splitUserNames = [];
    for (const user of split_users) {
        const { username } = user; 
        splitAmounts.push(equalAmount); 
        splitUserNames.push(username); 
    }

    return {splitAmounts,splitUserNames};
}

function percentage_split(split_users,expense_amount){
    let totalPercentage = 0;
    let splitAmounts = [];
    let splitUserNames = [];
    for (const user of split_users) {
        const { username, percentage } = user; // Extract username and percentage
        
        // Validate the percentage for each user
        if (percentage === undefined || percentage < 0) {
            return res.status(400).send({ error: "Each user's percentage must be specified and cannot be negative" });
        }
        totalPercentage += percentage; // Keep a running total of percentages
        const splitAmount = (percentage / 100) * expense_amount;
        splitAmounts.push(splitAmount); 
        splitUserNames.push(username);
    }
    return {splitAmounts,splitUserNames};
}

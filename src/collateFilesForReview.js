/* eslint-disable filenames/match-regex */
const fs = require('fs')
const readline = require('readline')
const { execPromise } = require('./utils')

const collateFilesForReview = async () => {
  try {
    // 1. Get the files that have had lines changed in the PR
    await execPromise(`git diff HEAD^1 --numstat --output=diff_stats_raw.txt`)

    // 2. Remove files that have less than 3 added lines
    await execPromise(
      `awk '$1 >= 3 { print $3 }' diff_stats_raw.txt > diff_stats_only_paths_with_gte_3_lines_added.txt`
    )

    // 3. Remove files that are longer than 200 lines
    // This will create a file that has the file paths the files that should be reviewed by the AI
    const readInterface = readline.createInterface({
      input: fs.createReadStream(
        'diff_stats_only_paths_with_gte_3_lines_added.txt'
      ),
      output: process.stdout,
      console: false
    })

    for await (const filePath of readInterface) {
      const stdout = await execPromise(
        `cd .. && wc -l ${filePath} | awk '{if ($1 < 200) print $2}' >> src/diff_stats_only_paths_with_gte_3_lines_added_and_lt_200_lines.txt`
      )
      console.log(`path: ${filePath}`)
      console.log(`stdout: ${stdout}`)
    }
  } catch (error) {
    console.error(error)
  }
}

collateFilesForReview()

module.exports = {
  collateFilesForReview
}

s3cmd del --recursive s3://math-teaching-tools/app/
s3cmd put --recursive app s3://math-teaching-tools/
s3cmd put index.html s3://math-teaching-tools/index.html
